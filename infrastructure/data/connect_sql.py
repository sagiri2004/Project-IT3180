import mysql.connector

# Thông tin đăng nhập vào MySQL
conn = mysql.connector.connect(
    host='localhost',         # đổi nếu MySQL nằm trên server khác
    user='root',     # ví dụ: 'root'
    password='root', # ví dụ: '123456'
    database='ktpm_db'  # ví dụ: 'population_db'
)

cursor = conn.cursor()

# Đọc và thực thi file SQL
with open("generated_data_vnd.sql", "r", encoding="utf-8") as f:
    sql_script = f.read()

# Thực thi từng câu lệnh SQL
for statement in sql_script.strip().split(';\n'):
    if statement.strip():
        try:
            cursor.execute(statement)
        except mysql.connector.Error as err:
            print(f"❌ Lỗi khi thực thi SQL:\n{statement}\n--> {err}")

conn.commit()
cursor.close()
conn.close()

print("✅ Đã thực thi file SQL vào MySQL thành công.")
