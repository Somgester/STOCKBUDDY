import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import unquote



def scrapsymb2(tick):
    ticker = unquote(tick)
    url=f'https://www.google.com/finance/quote/{ticker}:NSE'
    # while True:
    response = requests.get(url)

    soup = BeautifulSoup(response.text, 'html.parser')

    script_tags = soup.find_all('script')

    price_pattern = re.compile(r'"INR"\s*,\s*\[\s*(\d+)')
    price_pattern2 = re.compile(r'null\s*,\s*(\d+)')
    curr_price=0
    open_price=20
    match=False
    match2=False
    if response:
        for script in script_tags:
            script_content = script.string
            if script_content:
                match = price_pattern.search(script_content)
                match2 = price_pattern2.search(script_content)
                if match and match2:
                    price = match.group(1)
                    price2 = match2.group(1)
                    curr_price=price
                    open_price=price2
                    print(curr_price,open_price)
                    break
        if script_tags and match and match2:  
            print(curr_price,open_price)
            return [curr_price,open_price]
        else:
            return [-1,-1]

        
def scrapsymb(tick):
    url=f'https://www.google.com/finance/quote/{tick}:NSE'
    # while True:
    response = requests.get(url)

    soup = BeautifulSoup(response.text, 'html.parser')
    div_tag = soup.find_all('div',class_='YMlKec fxKbKc')
    div_tag2 = soup.find_all('div',class_='P6K39c')
    values=[]
    for div_tag in div_tag:
        value_text = div_tag.text.strip()
        if '₹' in value_text:
            value = value_text.replace('₹', '').strip()
            value = float(value.replace(',', '').strip())
            values.append(value)
            break
    for div_tag in div_tag2:
        value_text = div_tag.text.strip()
        if '₹' in value_text:
            value = value_text.replace('₹', '').strip()
            value = float(value.replace(',', '').strip())
            values.append(value)
            break

    return values