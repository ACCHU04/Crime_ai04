"""Service: NetworkX graph analysis for criminal networks."""
import networkx as nx
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models
from app.schemas.analytics import GraphNode, GraphEdge, GraphStats, GraphResult


def build_crime_graph(db: Session) -> GraphResult:
    """Full crime-connection graph: cases ↔ accused ↔ victims ↔ officers ↔ districts."""
    G = nx.Graph()

    cases = db.query(models.CaseMaster).all()
    for case in cases:
        case_id = f"case-{case.id}"
        G.add_node(case_id, type="case", label=case.fir_number)

        # District node
        if case.district_id:
            dist_node = f"district-{case.district_id}"
            if not G.has_node(dist_node):
                G.add_node(dist_node, type="district",
                           label=case.district.district_name if case.district else str(case.district_id))
            G.add_edge(case_id, dist_node, type="occurred_in")

        # Accused nodes
        for acc in case.accused:
            acc_node = f"accused-{acc.id}"
            G.add_node(acc_node, type="accused", label=acc.accused_name)
            G.add_edge(acc_node, case_id, type="accused_in")

        # Victim nodes
        for vic in case.victims:
            vic_node = f"victim-{vic.id}"
            G.add_node(vic_node, type="victim", label=vic.victim_name)
            G.add_edge(vic_node, case_id, type="victim_of")

        # Officer node
        if case.investigating_officer_id:
            officer_node = f"officer-{case.investigating_officer_id}"
            if not G.has_node(officer_node):
                emp = case.investigating_officer
                G.add_node(officer_node, type="officer",
                           label=emp.first_name if emp else str(case.investigating_officer_id))
            G.add_edge(officer_node, case_id, type="assigned_to")

    return _nx_to_result(G)


def get_person_associates(db: Session, person_name: str) -> GraphResult:
    """1-hop neighbourhood around a person (accused or victim) by name."""
    full_result = build_crime_graph(db)

    match_id = None
    for node in full_result.nodes:
        if node.label.lower() == person_name.lower():
            match_id = node.id
            break

    if not match_id:
        return GraphResult(
            nodes=[], edges=[],
            stats=GraphStats(total_nodes=0, total_edges=0, connected_components=0,
                             cases=0, accused_persons=0, victims=0),
        )

    neighbors = set()
    for edge in full_result.edges:
        if edge.source == match_id:
            neighbors.add(edge.target)
        elif edge.target == match_id:
            neighbors.add(edge.source)
    keep = {match_id} | neighbors

    filtered_nodes = [n for n in full_result.nodes if n.id in keep]
    filtered_edges = [e for e in full_result.edges if e.source in keep and e.target in keep]

    stats = GraphStats(
        total_nodes=len(filtered_nodes),
        total_edges=len(filtered_edges),
        connected_components=1,
        cases=sum(1 for n in filtered_nodes if n.type == "case"),
        accused_persons=sum(1 for n in filtered_nodes if n.type == "accused"),
        victims=sum(1 for n in filtered_nodes if n.type == "victim"),
    )
    return GraphResult(nodes=filtered_nodes, edges=filtered_edges, stats=stats)


def get_common_accused(db: Session) -> GraphResult:
    """Graph of accused persons linked to 2+ cases."""
    rows = (
        db.query(models.Accused.id, models.Accused.accused_name)
        .join(models.CaseMaster, models.Accused.case_id == models.CaseMaster.id)
        .group_by(models.Accused.id)
        .having(func.count(models.Accused.case_id) > 1)
        .all()
    )
    if not rows:
        return GraphResult(
            nodes=[], edges=[],
            stats=GraphStats(total_nodes=0, total_edges=0, connected_components=0,
                             cases=0, accused_persons=0, victims=0),
        )

    G = nx.Graph()
    for acc_id, acc_name in rows:
        acc_node = f"accused-{acc_id}"
        G.add_node(acc_node, type="accused", label=acc_name)

        acc_cases = (
            db.query(models.CaseMaster)
            .join(models.Accused, models.Accused.case_id == models.CaseMaster.id)
            .filter(models.Accused.id == acc_id)
            .all()
        )
        for case in acc_cases:
            case_node = f"case-{case.id}"
            if not G.has_node(case_node):
                G.add_node(case_node, type="case", label=case.fir_number)
            G.add_edge(acc_node, case_node, type="accused_in")

    return _nx_to_result(G)


def _nx_to_result(G: nx.Graph) -> GraphResult:
    """Convert NetworkX graph to frontend-friendly GraphResult."""
    nodes = [
        GraphNode(id=n, type=G.nodes[n].get("type", "unknown"),
                  label=G.nodes[n].get("label", n))
        for n in G.nodes
    ]
    edges = [
        GraphEdge(source=u, target=v, type=d.get("type", "connected"))
        for u, v, d in G.edges(data=True)
    ]
    stats = GraphStats(
        total_nodes=len(nodes),
        total_edges=len(edges),
        connected_components=nx.number_connected_components(G),
        cases=sum(1 for n in nodes if n.type == "case"),
        accused_persons=sum(1 for n in nodes if n.type == "accused"),
        victims=sum(1 for n in nodes if n.type == "victim"),
    )
    return GraphResult(nodes=nodes, edges=edges, stats=stats)
