from flask import Flask, render_template
import requests
from check import check
from flask_cors import CORS
# import webbrowser
# import os

app = Flask(__name__)
CORS(app)

# Only open the browser if this is the main process
# if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
# webbrowser.open_new("http://127.0.0.1:5000/")

@app.route('/ai/content')
def fetch_html_content():
    # url = "https://example.com"
    val = response.args.ask
    response = check(val)
    html_content = ""
    for script in response:
        html_content += script.get_attribute('innerHTML')
    return render_template('index.html', html_content=html_content)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
    