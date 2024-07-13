import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import unquote
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
driver = None
def finddriver():
    global driver
    if driver is not None:
        return driver
    else:
        brave_path = "/usr/bin/brave-browser"
        options = webdriver.ChromeOptions()
        options.binary_location = brave_path
        # options.add_argument('--headless')
        driver = webdriver.Chrome(options=options)
        return driver

def check(val):
    driver = finddriver()
    print(val)
    url = f'https://search.brave.com/search?q=money+control+stock+price+quote+{val}+sentiment&source=web&summary=1&summary_og=a6679b4b51cbf375e6b601'
    driver.get(url)
    wait = WebDriverWait(driver, 30)
    script_tags = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'llm-output')))
    # for script in script_tags:
    #     print(script.get_attribute('innerHTML'))
    return script_tags
    driver.quit()