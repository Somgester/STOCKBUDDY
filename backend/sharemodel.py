from mongoengine import Document,StringField,FloatField,IntField,connect
connect('Shares', host='mongodb+srv://text:123@cluster0.stfphmt.mongodb.net/')
class Share(Document):
  symbol = StringField(required=True)
  price = FloatField(required=True)
  quantity = IntField(required=True)

class Profit(Document):
  symbol=StringField(required=True)
  profit = IntField()

