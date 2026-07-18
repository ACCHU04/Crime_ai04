from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class CrimeSubHead(Base):
    __tablename__ = "crimesubhead"

    id                  = Column("crimesubheadid", Integer, primary_key=True)
    crime_head_id       = Column("crimeheadid", ForeignKey("crimehead.crimeheadid"))
    crime_subhead_name  = Column("crimesubheadname", String(200), nullable=False)
    active              = Column(Boolean, default=True)

    crime_head = relationship("CrimeHead")

    def __repr__(self):
        return f"<CrimeSubHead id={self.id} name={self.crime_subhead_name}>"
