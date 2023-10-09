from mongoengine import Document, StringField, IntField

class DataModel(Document):
    end_year = IntField()
    intensity = IntField()
    sector = StringField()
    topic = StringField()
    insight = StringField()
    url = StringField()
    region = StringField()
    start_year = IntField()
    impact = IntField()
    added = StringField()
    published = StringField()
    country = StringField()
    relevance = IntField()
    pestle = StringField()
    source = StringField()
    title = StringField()
    likelihood = IntField()

    meta = {
        'collection': 'blackcoffer_data'
    }
