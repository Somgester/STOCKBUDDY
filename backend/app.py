from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import time
from threading import Thread
import json
import smarty
from pymongo import MongoClient
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import json
client = MongoClient()
app = Flask(__name__)
CORS(app)

from sharemodel import Share,Profit

@app.route('/api/searching', methods=['GET'])
def ge_data():
    symb = request.args.get('symbol')
    url = f'https://groww.in/v1/api/search/v3/query/global/st_p_query?page=0&query={symb}&size=1&web=true'
    headers = {
        'Content-Type': 'application/json',
    }
    res=requests.get(url,headers=headers)
    # final
    if(res.ok):
        res=res.json()
        res=res['data']['content'][0]['nse_scrip_code']
        url = f'https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/{res}/latest'
        headers = {
            'Content-Type': 'application/json',
        }
        final=requests.get(url,headers=headers)
        final=final.json()
        if res:
            return jsonify(round(final['ltp'],1),[round(final['open'],1),round(final['high'],1),res])
        else:
             return []
    return final

@app.route('/buy', methods=['POST'])
def buy_share():
    data = request.get_json()
    syy=data['symbol']
    prr=data['price']
    qtt=data['qtx']
    symb = syy
    url = f'https://groww.in/v1/api/search/v3/query/global/st_p_query?page=0&query={symb}&size=1&web=true'
    headers = {
        'Content-Type': 'application/json',
    }
    res=requests.get(url,headers=headers)
    ree =res
    if(res.ok):
        res=res.json()
        syy=res['data']['content'][0]['nse_scrip_code']
        check = Share.objects(symbol=syy)
        if check:
            # print(check)
            check=check.first()
            check.price=((check.price*check.quantity)+(float(prr)*float(qtt)))/(float(qtt)+float(check.quantity))
            check.quantity=check.quantity+float(qtt)
            check.save()
            return jsonify({'message': f'Share bought successfully id :{check.id}'})
        else:
            # print("hello")
            new_share = Share(symbol=syy,price=prr,quantity=qtt)
            new_share.save()
            return jsonify({'message': f'Share bought successfully id'})
    else:
        return ree

@app.route('/api/sell', methods=['DELETE'])
def delete_share():
    symb = request.args.get('symbol')
    prof=int(request.args.get('profit'))
    profit_doc = Profit.objects(symbol=symb).first()
    if profit_doc:
        profit_doc.profit += float(prof)
    else:
        profit_doc = Profit(symbol=symb, profit=prof)
    profit_doc.save()
    share_to_delete = Share.objects(symbol=symb).first()
    if share_to_delete:
        share_to_delete.delete()
    return {"message":"deleted"}

@app.route('/api/profit', methods=['GET'])
def share_profit():
        profits = Profit.objects().all()
        tot=0
        for obj in profits:
            tot+=obj.profit
        return jsonify({"profit":f'{tot}'})
        

@app.route('/shares', methods=['GET'])
def main_page():
    objs=Share.objects().all()
    share_list=[]
    for obj in objs:
        share_list.append({
            'symbol':obj.symbol,
            'price':obj.price,
            'quantity':obj.quantity,
        })
    return jsonify(share_list)


@app.route('/api/new-search', methods=['GET'])
def new_search():
    symb = request.args.get('symbol')
    result = scrapsymb(symb)  
    if result:
        result=[int(result[0]),int(result[1])]
    if result:
        return jsonify(result)
    return jsonify([])

@app.route('/api/old-data', methods=['GET'])
def graphdata():
    url='https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/TITAGARH/daily?intervalInMinutes=1&minimal=true'
    headers={
        'Content-Type':'application/json'
    }
    data=requests.get(url,headers=headers)
    if data.ok:
        return data.json()
    return 'sorry'
@app.route('/api/live', methods=['GET'])
def graphdatalive():
    url='https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/TITAGARH/latest'
    headers={
        'Content-Type':'application/json'
    }
    data=requests.get(url,headers=headers)
    if data.ok:
        z=data.json()
        dat=[z['ltp'],z['tsInMillis']]
        return [z['tsInMillis'],z['ltp']]
    return 'sorry'
@app.route('/api/model', methods=['GET'])
def modelhandler():
    # url='https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/TITAGARH?endTimeInMillis=1830151100000&intervalInMinutes=5&startTimeInMillis=1720151100000'
    url='https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/TITAGARH/daily?intervalInMinutes=5'
    headers={
        'Content-Type':'application/json'
    }
    data=requests.get(url,headers=headers)
    if data.ok:
        z=data.json()
        z=z['candles']
        pred=smarty.modelhandle(z)
        return {"ans":pred}
    return 'sorry'
if __name__ == '__main__':
    app.run(debug=True)