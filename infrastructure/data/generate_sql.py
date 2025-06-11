from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker('vi_VN')  # Sử dụng Faker cho tiếng Việt

# New Configuration (đã cập nhật)
NUM_HOUSEHOLDS = 100
NUM_RESIDENTS = 400
NUM_DONATION_CAMPAIGNS = 50
NUM_DONATIONS = 2000
NUM_FEE_TYPES = 30
NUM_FEE_COLLECTIONS = 2000
NUM_POPULATION_CHANGES = 150
NUM_VEHICLES = 200  # Mỗi hộ gia đình có khoảng 2 phương tiện
NUM_VEHICLE_FEES = 1000  # Mỗi phương tiện có khoảng 5 phí gửi xe
NUM_UTILITY_BILLS = 3000  # Mỗi hộ gia đình có khoảng 30 hóa đơn tiện ích

now = datetime.now()
start_date = now - timedelta(days=365 * 5)

sql_statements = []

# Households - Tạo lại hoàn toàn với số lượng lớn
for i in range(1, NUM_HOUSEHOLDS + 1):
    sql_statements.append(f"""
INSERT INTO households (id, address, apartment_number, aream2, created_at, created_by, household_code, owner_name, phone_number, registration_date)
VALUES ({i}, '{fake.address().replace("'", "''")}', 'APT{i}', {round(random.uniform(50, 120), 2)}, '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}',
        'admin', 'HS{i:03d}', '{fake.name().replace("'", "''")}', '{fake.phone_number()}', '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}');
""")

# Residents - Tạo lại hoàn toàn với số lượng lớn
for i in range(1, NUM_RESIDENTS + 1):
    household_id = random.randint(1, NUM_HOUSEHOLDS)
    gender = random.choice(['MALE', 'FEMALE', 'OTHER'])
    relationship = random.choice(['OWNER','SPOUSE','CHILD','PARENT','SIBLING','GRANDPARENT','OTHER'])
    is_owner = 1 if relationship == 'OWNER' else 0
    sql_statements.append(f"""
INSERT INTO residents (id, created_at, created_by, date_of_birth, full_name, gender, id_card_number, is_owner, relationship_with_owner, household_id)
VALUES ({i}, '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}', 'admin', '{fake.date_of_birth(minimum_age=1, maximum_age=90)}',
        '{fake.name().replace("'", "''")}', '{gender}', '{fake.unique.ssn()}', {is_owner}, '{relationship}', {household_id});
""")

# Donation Campaigns - Tạo lại hoàn toàn với số lượng lớn
for i in range(1, NUM_DONATION_CAMPAIGNS + 1):
    start = fake.date_between(start_date='-2y', end_date='today')
    end = start + timedelta(days=random.randint(10, 100))
    sql_statements.append(f"""
INSERT INTO donation_campaigns (id, created_at, created_by, description, end_date, name, start_date, target_amount)
VALUES ({i}, '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}', 'admin', '{fake.sentence(nb_words=6)}', 
        '{end}', 'Campaign {i}', '{start}', {random.randint(1000000, 10000000)});
""")

# Donations - Tạo lại hoàn toàn với số lượng lớn
for i in range(1, NUM_DONATIONS + 1):
    household_id = random.randint(1, NUM_HOUSEHOLDS)
    campaign_id = random.randint(1, NUM_DONATION_CAMPAIGNS)
    sql_statements.append(f"""
INSERT INTO donations (id, amount, created_at, created_by, donation_date, donation_campaign_id, household_id)
VALUES ({i}, {round(random.uniform(50000, 500000), 2)}, '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}',
        'admin', '{fake.date_between(start_date='-2y', end_date='today')}', {campaign_id}, {household_id});
""")

# Fee Types - Tạo lại hoàn toàn với số lượng lớn
for i in range(1, NUM_FEE_TYPES + 1):
    sql_statements.append(f"""
INSERT INTO fee_types (id, created_at, created_by, description, is_perm2, is_required, name, price_perm2)
VALUES ({i}, '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}', 'admin', '{fake.sentence(nb_words=4)}',
        {random.choice([0, 1])}, {random.choice([0, 1])}, 'Loại phí {i}', {round(random.uniform(10000, 100000), 2)});
""")

# Fee Collections - Tạo lại hoàn toàn với số lượng lớn (Kiểm tra tính duy nhất của khóa)
used_fee_keys = set()
i = 1
while i <= NUM_FEE_COLLECTIONS:
    household_id = random.randint(1, NUM_HOUSEHOLDS)
    fee_type_id = random.randint(1, NUM_FEE_TYPES)
    month_year = fake.date(pattern="%Y-%m")
    key = (household_id, fee_type_id, month_year)

    if key in used_fee_keys:
        continue

    used_fee_keys.add(key)
    is_paid = random.choice([0, 1])
    paid_date = f"'{fake.date_between(start_date='-1y', end_date='today')}'" if is_paid else "NULL"
    name = fake.name().replace("'", "''")
    paid_by = f"'{name}'" if is_paid else "NULL"

    sql_statements.append(f"""
INSERT INTO fee_collections (id, amount, collected_by, created_at, created_by, is_paid, paid_by, paid_date, month_year, fee_type_id, household_id)
VALUES ({i}, {round(random.uniform(50000, 200000), 2)}, 'Collector {i}', '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}',
        'admin', {is_paid}, {paid_by}, {paid_date}, '{month_year}', {fee_type_id}, {household_id});
""")
    i += 1

# Population Changes - Tạo lại hoàn toàn với số lượng lớn
for i in range(1, NUM_POPULATION_CHANGES + 1):
    household_id = random.randint(1, NUM_HOUSEHOLDS)
    resident_id = random.randint(1, NUM_RESIDENTS)
    change_type = random.choice(['BIRTH','CHANGE_INFO','DEATH','MOVE_IN','MOVE_OUT','TEMPORARY_ABSENCE','TEMPORARY_RESIDENCE'])
    start = fake.date_between(start_date='-3y', end_date='today')
    end = start + timedelta(days=random.randint(10, 365))
    sql_statements.append(f"""
INSERT INTO population_changes (id, change_type, created_at, created_by, destination_address, end_date, is_approved, reason, source_address, start_date, household_id, resident_id)
VALUES ({i}, '{change_type}', '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}', 'admin', '{fake.address().replace("'", "''")}',
        '{end}', {random.choice([0, 1])}, '{fake.sentence(nb_words=5)}', '{fake.address().replace("'", "''")}', '{start}', {household_id}, {resident_id});
""")

# Vehicles - Tạo dữ liệu cho phương tiện
for i in range(1, NUM_VEHICLES + 1):
    household_id = random.randint(1, NUM_HOUSEHOLDS)
    vehicle_type = random.choice(['motorbike', 'car'])
    # Tạo biển số xe ngẫu nhiên theo định dạng Việt Nam
    if vehicle_type == 'motorbike':
        license_plate = f"{random.choice(['29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '43', '47', '48', '49', '50', '51', '52', '54', '56', '58', '60', '61', '62', '63', '64', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '92', '93', '94', '95', '97', '98', '99'])}-{random.randint(100, 999)}.{random.randint(10, 99)}"
    else:
        license_plate = f"{random.choice(['29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '43', '47', '48', '49', '50', '51', '52', '54', '56', '58', '60', '61', '62', '63', '64', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '92', '93', '94', '95', '97', '98', '99'])}-{random.randint(100, 999)}.{random.randint(100, 999)}"
    
    registered_date = fake.date_between(start_date='-5y', end_date='today')
    sql_statements.append(f"""
INSERT INTO vehicles (id, household_id, license_plate, type, registered_date, is_active, created_by, created_at)
VALUES ({i}, {household_id}, '{license_plate}', '{vehicle_type}', '{registered_date}', {random.choice([0, 1])}, 'admin',
        '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}');
""")

# Vehicle Fees - Tạo dữ liệu cho phí gửi xe
used_vehicle_fee_keys = set()
i = 1
while i <= NUM_VEHICLE_FEES:
    vehicle_id = random.randint(1, NUM_VEHICLES)
    month_year = fake.date(pattern="%Y-%m")
    key = (vehicle_id, month_year)

    if key in used_vehicle_fee_keys:
        continue

    used_vehicle_fee_keys.add(key)
    is_paid = random.choice([0, 1])
    paid_date = f"'{fake.date_between(start_date='-1y', end_date='today')}'" if is_paid else "NULL"
    name = fake.name().replace("'", "''")
    paid_by = f"'{name}'" if is_paid else "NULL"

    sql_statements.append(f"""
INSERT INTO vehicle_fees (id, vehicle_id, month_year, amount, is_paid, paid_date, paid_by, collected_by, created_by, created_at)
VALUES ({i}, {vehicle_id}, '{month_year}', {round(random.uniform(50000, 200000), 2)}, {is_paid}, {paid_date}, {paid_by},
        'Collector {i}', 'admin', '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}');
""")
    i += 1

# Utility Bills - Tạo dữ liệu cho hóa đơn tiện ích
used_utility_bill_keys = set()
i = 1
while i <= NUM_UTILITY_BILLS:
    household_id = random.randint(1, NUM_HOUSEHOLDS)
    utility_type = random.choice(['electricity', 'water', 'internet'])
    month_year = fake.date(pattern="%Y-%m")
    key = (household_id, utility_type, month_year)

    if key in used_utility_bill_keys:
        continue

    used_utility_bill_keys.add(key)
    is_paid = random.choice([0, 1])
    paid_date = f"'{fake.date_between(start_date='-1y', end_date='today')}'" if is_paid else "NULL"
    name = fake.name().replace("'", "''")
    paid_by = f"'{name}'" if is_paid else "NULL"

    # Đặt số tiền khác nhau cho từng loại tiện ích
    if utility_type == 'electricity':
        amount = round(random.uniform(200000, 1000000), 2)  # 200k - 1tr
    elif utility_type == 'water':
        amount = round(random.uniform(50000, 200000), 2)  # 50k - 200k
    else:  # internet
        amount = round(random.uniform(100000, 500000), 2)  # 100k - 500k

    sql_statements.append(f"""
INSERT INTO utility_bills (id, household_id, month_year, type, amount, is_paid, paid_date, paid_by, collected_by, created_by, created_at)
VALUES ({i}, {household_id}, '{month_year}', '{utility_type}', {amount}, {is_paid}, {paid_date}, {paid_by},
        'Collector {i}', 'admin', '{fake.date_time_between(start_date=start_date, end_date=now).isoformat(sep=" ")}');
""")
    i += 1

# Final SQL script
final_sql_script = "\n".join(sql_statements)

# Save to file (optional)
with open("generated_data_vnd.sql", "w", encoding="utf-8") as f:
    f.write(final_sql_script)

print(f"✅ Script generated with {len(sql_statements)} SQL INSERTs.")
