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

# Final SQL script
final_sql_script = "\n".join(sql_statements)

# Save to file (optional)
with open("generated_data_vnd.sql", "w", encoding="utf-8") as f:
    f.write(final_sql_script)

print(f"✅ Script generated with {len(sql_statements)} SQL INSERTs.")
