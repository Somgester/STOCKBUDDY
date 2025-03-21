import numpy as np
import pandas as pd
def compute_features(tr, fut, data):
    import seaborn as sns
    import matplotlib.pyplot as plt
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import MinMaxScaler
    from sklearn.metrics import mean_squared_error
    import datetime
    import json
    scaler=MinMaxScaler()
    # Convert data to numpy array if not already
    data = np.array(data)
    
    # Create DataFrame
    # df = pd.DataFrame(data, columns=['timestamp','open', 'high', 'low', 'close', 'volume'])

    # Calculate future labels
    future = []
    for i in range(len(data)-fut):
        pos = np.sum([((data[i+z,4] - data[i,4]) / data[i,4]) >= 0.01 for z in range(0, fut + 1)])
        neg = np.sum([((data[i+z,4] - data[i,4]) / data[i,4]) <= -0.01 for z in range(0, fut + 1)])
        if pos > neg:
            future.append(1)
        elif neg > pos:
            future.append(-1)
        else:
            future.append(0)
    summ=[]
    sumi=0
    for i in range(fut,len(data)):
        pos = np.sum([((data[i,4] - data[i-z,4]) / data[i,4]) >= 0.01 for z in range(0, fut + 1)])
        neg = np.sum([((data[i,4] - data[i-z,4]) / data[i,4]) <= -0.01 for z in range(0, fut + 1)])
        summ.append(sumi)
        if pos > neg:
            sumi+=1
        elif neg > pos:
            sumi-=1

    # Pad the future list with NaN values at the end to match the length of the DataFrame
    future = future + [5]*fut
    summ=[np.nan]*fut+summ

    def transform_timestamp(timestamp):
        dt = datetime.datetime.utcfromtimestamp(timestamp)
        new_dt = datetime.datetime(1970, 1, 1, dt.hour, dt.minute)  
        new_timestamp = int(new_dt.timestamp())
        return new_timestamp


    # Add future labels to DataFrame
    transformed_times = np.array([transform_timestamp(ts) for ts in data[:, 0]])
    
    for i in range(0,len(data)-72,72):
            data[i:i+72]=scaler.fit_transform(data[i:i+72])+1
    
    data=np.column_stack((data,summ,future))
    df = pd.DataFrame(data, columns=['timestamp','open', 'high', 'low', 'close', 'volume','summ','future'])

    # Simple Moving Averages (SMA)
    df['SMA_5'] = df['close'].rolling(window=tr).mean()
    df['SMA_10'] = df['close'].rolling(window=tr*2).mean()

    # Exponential Moving Averages (EMA)
    df['EMA_5'] = df['close'].ewm(span=tr, adjust=False).mean()
    df['EMA_10'] = df['close'].ewm(span=tr*2, adjust=False).mean()

    # Relative Strength Index (RSI)
    delta = df['close'].diff(1)
    gain = (delta.where(delta > 0, 0)).rolling(window=tr).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=tr).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))

    # Moving Average Convergence Divergence (MACD)
    ema_12 = df['close'].ewm(span=tr, adjust=False).mean()
    ema_26 = df['close'].ewm(span=tr*2, adjust=False).mean()
    df['MACD'] = ema_12 - ema_26
    df['MACD_signal'] = df['MACD'].ewm(span=9, adjust=False).mean()

    # Bollinger Bands
    df['BB_Middle'] = df['close'].rolling(window=tr*2).mean()
    df['BB_Upper'] = df['BB_Middle'] + (2 * df['close'].rolling(window=tr*2).std())
    df['BB_Lower'] = df['BB_Middle'] - (2 * df['close'].rolling(window=tr*2).std())

    # On-Balance Volume (OBV)
    df['OBV'] = (np.sign(df['close'].diff()) * df['volume']).fillna(0).cumsum()

    # True Range (TR) and Average True Range (ATR)
    df['H-L'] = df['high'] - df['low']
    df['H-PC'] = abs(df['high'] - df['close'].shift(1))
    df['L-PC'] = abs(df['low'] - df['close'].shift(1))
    df['TR'] = df[['H-L', 'H-PC', 'L-PC']].max(axis=1)
    df['ATR'] = df['TR'].rolling(window=tr*6).mean()

    # Price Rate of Change (ROC)
    df['ROC'] = df['close'].pct_change(periods=tr)

    # Momentum
    df['Momentum'] = df['close'].diff(tr)

    # Standard Deviation of Price
    df['Std_Dev'] = df['close'].rolling(window=tr*2).std()

    # Adding the price differences to the DataFrame
    listi = [df['close'].iloc[i+fut] for i in range(0, len(data)-fut)]
    # Dropping rows with NaN values
    df.dropna(inplace=True)
    df = df.reset_index(drop=True)
    # Save DataFrame to CSV
    X = df
    al = X['future']
    X = X.drop(columns=['future'])
    X['future'] = al
    timi=X['timestamp']
    X.to_csv('dfinal.csv', index=False)

    return X,timi

def modelhandle(data):
    import seaborn as sns
    import matplotlib.pyplot as plt
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.metrics import mean_squared_error
    import json
    from keras.models import load_model
    import datetime
    import pytz
    from PIL import Image

    tr = 12
    fut = 12
    freedom = 2
    df_with_features,timi = compute_features(tr, fut, data)

    # Load the LSTM model
    model = load_model(f'{tr}_{fut}min(pro3).keras')
    fut += freedom
    data = df_with_features
    closes=df_with_features['close']
    data = np.array(data)

    def transform_timestamp(timestamp):
        dt = datetime.datetime.utcfromtimestamp(timestamp)
        new_dt = datetime.datetime(1970, 1, 1, dt.hour, dt.minute)
        new_timestamp = int(new_dt.timestamp())
        return new_timestamp

    data = np.array(data)
    # scaler.fit(data)
    future = data[1:, -1]
    data = data[1:, :-1]
    print(data)
    label_mapping = {0: "sell", 1: "hold", 2: "buy"}
    predictions = model.predict(data)
    pred = np.argmax(predictions, axis=1)
    pred = [label_mapping[label] for label in pred]
    closes=np.array(closes)
    pred=np.column_stack((pred,future,timi[1:],closes[1:]))
    pred_list = pred.tolist()
    return pred_list
