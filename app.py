from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import sqlite3
import os
from flask_bcrypt import Bcrypt
import ollama 


app = Flask(__name__)
app.secret_key = 'YourSecretKey'  # استخدمي مفتاح أقوى في بيئة الإنتاج
bcrypt = Bcrypt(app)

# دالة لإنشاء الاتصال بقاعدة البيانات
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# دالة تهيئة قاعدة البيانات وإنشاء جدول المستخدمين إذا لم يكن موجودًا
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE CHECK(email LIKE '%@gmail.com'),
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# تهيئة قاعدة البيانات عند تشغيل التطبيق
init_db()

# الصفحة الرئيسية
@app.route('/')
def index():
    return render_template('index.html')

# صفحة about
@app.route('/about')
def about():
    return render_template('about.html')

# صفحة المشاريع
@app.route('/projects')
def projects():
    return render_template('projects.html')

# صفحة التوصيات
@app.route('/recommendation', methods=['GET', 'POST'])
def recommendation():
    if request.method == 'GET':
        # عرض الصفحة بدون توليد أي محتوى
        return render_template('recommendation.html', generated_content=None)
    
    # عند معالجة طلب POST نتحقق من تسجيل الدخول
    if 'user_id' not in session:
        return jsonify({"error": "يجب عليك تسجيل الدخول أولاً!"}), 401

    generated_content = None
    if request.method == 'POST':
        donation_type = request.form.get("donation_type")
        amount = request.form.get("amount")
        duration = request.form.get("duration")

        prompt = f"""
        لديك حملة تبرع جديدة:
        - نوع التبرع: {donation_type}
        - المبلغ المستهدف: {amount} جنيه
        - المدة: {duration} يومًا

        ما هي التوصيات التي يمكن تقديمها لهذه الحملة لضمان نجاحها؟
        """

        response = ollama.chat(model="mistral", messages=[{"role": "user", "content": prompt}])
        generated_content = response['message']['content']
    
    return render_template('recommendation.html', generated_content=generated_content)


# مسار عرض صفحة تسجيل الدخول
@app.route('/login', methods=['GET'])
def show_login():
    return render_template('register.html')


# مسار تسجيل الدخول
@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if user:
        if bcrypt.check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            flash('تم تسجيل الدخول بنجاح!', 'success')
            return redirect(url_for('index'))
        else:
            flash('كلمة المرور غير صحيحة! الرجاء المحاولة مرة أخرى.', 'error')  # رسالة الخطأ هنا
    else:
        flash('البريد الإلكتروني غير مسجل! الرجاء إنشاء حساب جديد.', 'error')

    return render_template('register.html', email=email)

# مسار عرض صفحة التسجيل
@app.route('/register', methods=['GET'])
def show_register():
    return render_template('register.html')

# API للتحقق مما إذا كان البريد الإلكتروني مسجلًا بالفعل
@app.route('/check_email', methods=['POST'])
def check_email():
    email = request.json.get('email')

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    return jsonify({"exists": bool(user)})

# مسار إنشاء الحساب (التسجيل)
@app.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')

    if not email.endswith('@gmail.com'):
        flash('يجب أن يكون البريد الإلكتروني تابعًا لـ Gmail (مثال: user@gmail.com)!', 'error')
        return redirect(url_for('show_register'))

    conn = get_db_connection()
    existing_user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

    if existing_user:
        flash('البريد الإلكتروني مستخدم بالفعل! الرجاء إدخال بريد آخر.', 'error')
        return redirect(url_for('show_register'))

    if password != confirm_password:
        flash('كلمتا المرور غير متطابقتين!', 'error')
        return redirect(url_for('show_register'))

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                     (name, email, hashed_password))
        conn.commit()
        
        # تسجيل الدخول تلقائيًا بعد إنشاء الحساب
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        
        flash('تم إنشاء الحساب بنجاح! مرحبًا بك 😊', 'success')
        return redirect(url_for('index'))
    finally:
        conn.close()

# مسار تسجيل الخروج
@app.route('/logout')
def logout():
    session.clear()
    flash('تم تسجيل الخروج.', 'success')
    return redirect(url_for('index'))


# مسار استعادة كلمة المرور
@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()

        if user:
            flash('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.', 'success')
            return redirect(url_for('show_login'))
        else:
            flash('البريد الإلكتروني غير مسجل لدينا!', 'error')
            return redirect(url_for('forgot_password'))
    else:
        flash('ميزة استعادة كلمة المرور غير متاحة حالياً!', 'error')
        return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5010)