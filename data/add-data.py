import json
import mysql.connector

def insert_products():
    # Read the products.json file
    with open('dayify-server/data/products.json') as file:
        products = json.load(file)

    # Connect to the MySQL database
    connection = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='user',
        password='password',
        database='dayify'
    )

    # Create a cursor object to execute SQL queries
    cursor = connection.cursor()

    # Insert each product into the database
    for product in products:
        query = "INSERT INTO products (id, title, price, description, category, image, rating_rate, rating_count) VALUES (%s, %s, %s, %s, %s, %s)"
        values = (
            product['id'],
            product['title'],
            product['price'],
            product['description'],
            product['category'],
            product['image']
        )
        cursor.execute(query, values)

    # Commit the changes and close the connection
    connection.commit()
    connection.close()

insert_products()
