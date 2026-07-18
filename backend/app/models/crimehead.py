from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base


class CrimeHead(Base):
    __tablename__ = "crimehead"

    id              = Column("crimeheadid", Integer, primary_key=True)
    crime_head_name = Column("crimeheadname", String(200), nullable=False)
    active          = Column(Boolean, default=True)

    def __repr__(self):
        return f"<CrimeHead id={self.id} name={self.crime_head_name}>"
