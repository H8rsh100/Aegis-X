from flask import Flask, render_template, jsonify
from main import AegisX_Core

app = Flask(__name__)
engine = AegisX_Core()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def api_data():
    data = engine.get_api_data()
    return jsonify(data)

if __name__ == '__main__':
    # Run the Flask app on port 5050 to avoid conflicts
    app.run(debug=True, host='0.0.0.0', port=5050)
