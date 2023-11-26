import csv
import sys, re, random, sqlite3, datetime
from PyQt5.uic import loadUi
from PyQt5 import QtWidgets
from PyQt5.QtWidgets import QMainWindow, QWidget, QLineEdit, QLabel, QPushButton, QApplication, QStackedWidget




class Signup(QMainWindow):
    def __init__(self):
        super(Signup,self).__init__()
        loadUi("Signup.ui",self)
        self.Button_Login.clicked.connect(self.go_Login) # for sign up page
        self.Button_submit.clicked.connect(self.submit) # for sign up page

    def go_Login(self):
        login = LoginScreen()
        widget.addWidget(login)
        widget.setCurrentIndex(widget.currentIndex()+1) # to go to another window
    def submit(self):
        # print("Submit !! ")
        # import random
        # walletnumber = random.randint(1000000000,9999999999)
        # print(walletnumber)
        conn = sqlite3.connect("KSUPayDB.db") # Just for check all the values in the table
        cursor = conn.execute("SELECT * from ACCOUNT") # just for testing
        for x in cursor:
            print(x)
        cursor = conn.execute("SELECT * from ENTITIES") # just for testing
        for x in cursor:
            print(x)
        conn.close()
        self.label_error.setText("") # To reset the label text
        self.label_msg.setText("") # To reset the label text

        Fname = self.Fname_field.text() # return name
        Lname = self.Lname_field.text() # return name
        SID = self.SID_field.text() # return Student ID
        password = self.password_field.text() # return password
        email = self.email_field.text() # return email
        Phnum = self.PhNum_field.text() # return Phone number
        if len(Fname)==0 or len(Lname)==0 or len(SID)==0 or len(password)==0 or len(email)==0 or len(Phnum)==0: # To make sure all fields are not empty
            self.label_error.setText("Please Fill All Fields")
            return
        # For Names
        regname = "^[A-Za-z]+$"
        checkFname = re.search(regname,Fname)
        checkLname = re.search(regname,Lname)
        if (checkFname is None) or (checkLname is None):
            self.label_error.setText("name should not contain any numbers !")
            return
        # For SID
        regsid = "^[0-9]{10}$"
        checksid = re.search(regsid,SID)
        if (checksid is None):
            self.label_error.setText("Student ID should be 10 digits")
            return
        # For Password

        reg = "^(?=.*[A-Za-z0-9]{6})[A-Za-z0-9@$!#%*?&]+$"
        pat = re.compile(reg)
        Check = re.search(pat, password)
        if (Check is None):
            self.label_error.setText("The password should contain \n at least 6 digits or letters")
            return
        # For email
        reg2 = "^([a-zA-Z0-9\._-]+)(@ksu.edu.sa)$"
        pat2 = re.compile(reg2)
        CheckEmail = re.search(pat2, email)
        if (CheckEmail is None):
            self.label_error.setText("The email should be \n (For ex. email@ksu.edu.sa)")
            return

        # For Phone Number
        regnum = "^(05)[0-9]{8}$"
        CheckPhNum = re.search(regnum,Phnum)
        if (CheckPhNum is None): # Not meeting the requirements
            self.label_error.setText("Phone number should start with 05 \n And be 10 digits")
            return

        walletnumber = random.randint(1000000000,9999999999)
        timedate = datetime.datetime.now()
        timedate = timedate.strftime("%d-%m-%Y_%H-%M-%S")
        Type = "Student"
        balance = 1000
        print(f'{walletnumber},{timedate},{Type},{balance}')



        conn = sqlite3.connect("KSUPayDB.db")

        try:
            conn.execute(f'''INSERT INTO ACCOUNT (FNAME,LNAME,SID,PASSWORD,EMAIL,PHNUM,WALLETNUMBER,WALLETTYPE,BALANCE,DATETIME) 
                VALUES ('{Fname}','{Lname}',{SID},'{password}','{email}','{Phnum}',{walletnumber},'{Type}',{balance},'{timedate}');''')
            conn.commit()
        except sqlite3.IntegrityError: # if student is registered
            print("User already exist")
            self.label_error.setText("The user is already registered !")
            conn.close()
            return

        # If the user not registered
        conn.close()

        self.label_msg.setText("You have created the account successfully")
        Fname = self.Fname_field.setText("")
        Lname = self.Lname_field.setText("")
        SID = self.SID_field.setText("")
        password = self.password_field.setText("")
        email = self.email_field.setText("")
        Phnum = self.PhNum_field.setText("")
        # conn = sqlite3.connect("KSUPay.db")
        # print("Opened Database successfully")



class LoginScreen(QMainWindow):
    def __init__(self):
        super(LoginScreen, self).__init__()
        loadUi("loginScreen.ui",self)
        self.Button_LoginSys.clicked.connect(self.LoginSystem) # for login page

    def LoginSystem(self):
        ID = self.id_field.text()
        passwordLogin = self.pass_field.text()
        self.label_error.setText("") # To reset the label text
        if len(ID)==0 or len(passwordLogin)==0: # To make sure all fields are not empty
            self.label_error.setText("Please Fill All Fields")
            return
        reg = "^(?=.*[A-Za-z0-9]{6})[A-Za-z0-9@$!#%*?&]+$"
        Check = re.search(reg, passwordLogin)
        regsid = "^[0-9]{10}$"
        checksid = re.search(regsid,ID)
        if (checksid is None) or (Check is None):
            self.label_error.setText("Invalid ID or Password ,\n Please try again ")
            return
        conn = sqlite3.connect("KSUPayDB.db")
        try:
            query_id = 'SELECT SID FROM ACCOUNT WHERE SID = \''+ID+"\'" # to get ID
            query_pass = 'SELECT PASSWORD FROM ACCOUNT WHERE SID = \''+ID+"\'" # to get password and bc maybe another ID have same password
            query_type = 'SELECT WALLETTYPE FROM ACCOUNT WHERE SID = \''+ID+"\'" # to get password and bc maybe another ID have same password

            cursor = conn.execute(query_id)
            result_id = cursor.fetchone()[0]
            cursor = conn.execute(query_pass)
            result_pass = cursor.fetchone()[0]
            cursor = conn.execute(query_type)
            result_type = cursor.fetchone()[0]

            if (result_id == int(ID)) and (result_pass == passwordLogin):
                print("Successfully entered the system")
                if result_type == 'Student':
                    # print("The user is student !")
                    stdwallet = StudentWallet(ID)
                    widget.addWidget(stdwallet)
                    widget.setCurrentIndex(widget.currentIndex() + 1)
                elif result_type == 'Admin':
                    # print("The user is admin ! ")
                    admin = Admin()
                    widget.addWidget(admin)
                    widget.setCurrentIndex(widget.currentIndex() + 1)
            else:
                self.label_error.setText("The password or ID in not correct")
                conn.close()
                return
        except TypeError:
            self.label_error.setText("The ID in not registered in the system")
            conn.close()
            return

        conn.close()

class StudentWallet(QMainWindow):
    studentID = 0
    balance = 0
    def __init__(self,stdid):
        super(StudentWallet, self).__init__()
        loadUi("StudentWallet.ui",self)
        self.studentID = stdid # to get the student number from the previous page " Login "

        conn = sqlite3.connect("KSUPayDB.db")
        query_walletnum = 'SELECT WALLETNUMBER FROM ACCOUNT WHERE SID = \'' +self.studentID+ "\'"
        cursor = conn.execute(query_walletnum)
        result_walletnum = cursor.fetchone()[0]
        query_balance = 'SELECT BALANCE FROM ACCOUNT WHERE SID = \'' +self.studentID+ "\'"
        cursor = conn.execute(query_balance)
        result_balance = cursor.fetchone()[0]
        self.balance = str(result_balance)
        self.label_walletnum.setText(result_walletnum)
        self.label_balance.setText(self.balance)
        # testbal = 'SELECT SUM(BALANCE) FROM ACCOUNT'
        # cursor = conn.execute(testbal)
        # resultbaltest = cursor.fetchone()[0]
        # print(resultbaltest)
        conn.close()

        self.Button_pay.clicked.connect(self.pay) # for pay
        self.Button_Back.clicked.connect(self.back) # To back to sign up window
        print(self.studentID)
    def pay(self): # i need to check if i'm buying from myself
        walletnum = self.walletnum_field.text()
        amount = self.amount_field.text()
        self.label_error.setText("") # To reset the label text
        self.label_msg.setText("")

        if len(walletnum)==0 or len(amount)==0: # To make sure all fields are not empty
            self.label_error.setText("Please Fill All Fields")
            return
        regWallet = "^[0-9]{10}$" # To check if its meet the requirement
        regAmount = "^[0-9]+$" # To check if its meet the requirement
        checkWalletnum = re.search(regWallet,walletnum)
        checkAmount = re.search(regAmount,amount)
        if (checkAmount is None) or (checkWalletnum is None) or float(amount) == 0 or float(amount) < 0:
            self.label_error.setText("Invalid Wallet number or Amount ,\n Please try again ")
            return


        conn = sqlite3.connect("KSUPayDB.db") # 5226342094
        query_balance = 'SELECT BALANCE FROM ACCOUNT WHERE SID = \'' +self.studentID+ "\'"
        cursor = conn.execute(query_balance)
        result_balance = cursor.fetchone()[0]
        query_StdWalletNum = 'SELECT WALLETNUMBER FROM ACCOUNT WHERE SID = \'' + self.studentID + "\'"
        cursor = conn.execute(query_StdWalletNum)
        result_StdWalletNum = cursor.fetchone()[0]
        try: # For Ksu Entities , 5783181394
            query_ksu_Walnum = 'SELECT WALLETNUMBER FROM ENTITIES WHERE WALLETNUMBER = \'' +walletnum+ "\'"
            query_ksu_balance = 'SELECT BALANCE FROM ENTITIES WHERE WALLETNUMBER = \'' +walletnum+ "\'"

            cursor = conn.execute(query_ksu_Walnum)
            cursor2 = conn.execute(query_ksu_balance)
            res_ksu_wallet = cursor.fetchone()[0]
            res_ksu_balance = cursor2.fetchone()[0]
            if float(amount) > result_balance:
                self.label_error.setText("There is not enough money")  # msg error if balance is not enough
                conn.close()
                return

            totalbuyer = result_balance - float(amount)
            query_buyer = f'UPDATE ACCOUNT SET BALANCE = {totalbuyer} WHERE SID = {self.studentID}'
            conn.execute(query_buyer)
            totalseller = res_ksu_balance + float(amount)
            print(totalseller)

            query_seller = f'UPDATE ENTITIES SET BALANCE = {totalseller} WHERE WALLETNUMBER = {walletnum}'
            conn.execute(query_seller)
            print("Done successfully")
            cursor = conn.execute("SELECT * from ACCOUNT")
            for x in cursor:
                print(x)
            cursor = conn.execute("SELECT * from ENTITIES")
            for x in cursor:
                print(x)


            conn.commit()
            self.label_msg.setText("You have been purchase successfully")
            import logging
            logging.basicConfig(filename='transactions.log',
                                filemode='a',
                                format='%(asctime)s - %(message)s',
                                level=logging.INFO)
            logging.info(f' The Amount :  {str(amount)}, The Sender :  {result_StdWalletNum} , The receiver {walletnum}')

            walletnum = self.walletnum_field.setText("")
            amount = self.amount_field.setText("")
            self.balance = str(totalbuyer)
            self.label_balance.setText(str(totalbuyer))

            print("ITS EXIST ")
            conn.close()
            return
        except TypeError:
            print("Error no ksu entitie")
        try: # For Students
            query_checkWal = 'SELECT WALLETNUMBER FROM ACCOUNT WHERE WALLETNUMBER = \'' +walletnum+ "\'" # to check if its in sys
            query_balance_seller = 'SELECT BALANCE FROM ACCOUNT WHERE WALLETNUMBER = \'' +walletnum+ "\'" # to get balance if its in ssy

            cursor = conn.execute(query_checkWal)
            cursor2 = conn.execute(query_balance_seller)
            selleramount = cursor2.fetchone()[0]
            result_checkWal = cursor.fetchone()[0]
            print("Wallet number is exist !! ")

        except TypeError:
            self.label_error.setText("The Wallet number doesn't exist in the system") # msg error if its not in the sys
            conn.close()
            return
        if float(amount) > result_balance:
            self.label_error.setText("There is not enough money") # msg error if balance is not enough
            conn.close()
            return
        elif walletnum == result_StdWalletNum:
            self.label_error.setText("You can't buy from yourself !") # msg error if balance is not enough
            conn.close()
            return

        else: # if everything is correct then we do the transaction
            print("The amount is there ")
            totalbuyer = result_balance - float(amount)
            # print(str(totalbuyer))
            query_buyer = f'UPDATE ACCOUNT SET BALANCE = {totalbuyer} WHERE SID = {self.studentID}'
            conn.execute(query_buyer)
            totalseller = selleramount + float(amount)
            print(totalseller)

            query_seller = f'UPDATE ACCOUNT SET BALANCE = {totalseller} WHERE WALLETNUMBER = {walletnum}'
            conn.execute(query_seller)
            print("Done successfully")
            cursor = conn.execute("SELECT * from ACCOUNT")
            for x in cursor:
                print(x)

            conn.commit()
            self.label_msg.setText("You have been purchase successfully")
            import logging
            logging.basicConfig(filename='transactions.log',
                                filemode='a',
                                format='%(asctime)s - %(message)s',
                                level=logging.INFO)
            logging.info(f' The Amount :  {str(amount)}, The Sender :  {result_StdWalletNum} , The receiver {walletnum}')

        walletnum = self.walletnum_field.setText("")
        amount = self.amount_field.setText("")
        self.balance = str(totalbuyer)
        self.label_balance.setText(str(totalbuyer))

        conn.close()




    def back(self):
        signup = Signup()
        widget.addWidget(signup)
        widget.setCurrentIndex(widget.currentIndex() + 1)



class Admin(QMainWindow):
    def __init__(self):
        super(Admin, self).__init__()
        loadUi("Admin.ui",self)
        self.Button_submit.clicked.connect(self.submit) # Create new ksu entity
        self.Button_deposite.clicked.connect(self.deposite) # To pay all student 1000
        self.Button_cashout.clicked.connect(self.cashout) # for pay
        self.Button_Back.clicked.connect(self.back) # To back to sign up window
        self.Button_Backup.clicked.connect(self.backup) # To back to sign up window
        conn = sqlite3.connect("KSUPayDB.db") # 5226342094
        query_all_balance = 'SELECT SUM(BALANCE) FROM ENTITIES'
        cur = conn.execute(query_all_balance)
        all_balance = cur.fetchone()[0] # to get the sum of all the balance in KSU Entities
        self.label_totalbalance.setText(str(all_balance))
        conn.close()



    def submit(self):
        name = self.entityname_field.text()
        self.label_msg.setText("") # To clear the msg that showed up to the user
        self.label_error.setText("") # To clear the error msg '' ''
        if len(name) == 0:
            self.label_error.setText("You don't enter a name")
            return
        conn = sqlite3.connect("KSUPayDB.db")
        walletnumber = random.randint(1000000000,9999999999)
        timedate = datetime.datetime.now()
        timedate = timedate.strftime("%d-%m-%Y_%H-%M-%S")
        Type = "KSU"
        balance = 0
        conn.execute(f'''INSERT INTO ENTITIES (NAME,DATETIME,WALLETNUMBER,WALLETTYPE,BALANCE) 
            VALUES ('{name}','{timedate}',{walletnumber},'{Type}',{balance});''')
        conn.commit()
        self.label_msg.setText("Inserted into the database successfully ")
        # print("Inserted correctly")
        cursor = conn.execute("SELECT * from ENTITIES")
        for x in cursor:
            print(x)
        self.entityname_field.setText("")
        query_all_balance = 'SELECT SUM(BALANCE) FROM ENTITIES'
        cur = conn.execute(query_all_balance)
        all_balance = cur.fetchone()[0] # to get the sum of all the balance in KSU Entities
        self.label_totalbalance.setText(str(all_balance))


        conn.close()


    def deposite(self):
        self.label_msg.setText("") # To clear the msg that showed up to the user
        self.label_error.setText("") # To clear the error msg '' ''
        self.entityname_field.setText("") # To clear the NAME Field if the user enter anything
        # print("Pay to all student")
        conn = sqlite3.connect("KSUPayDB.db")
        deposite_query = f'UPDATE ACCOUNT SET BALANCE = BALANCE + {1000} WHERE WALLETTYPE = "Student"'
        conn.execute(deposite_query)
        cursor = conn.execute("SELECT * from ACCOUNT")
        for x in cursor:
            print(x)
        conn.commit()
        self.label_msg.setText("The money has been deposit\n To all the students")
        conn.close()
    def cashout(self):
        self.label_msg.setText("") # To clear the msg that showed up to the user
        self.label_error.setText("") # To clear the error msg '' ''
        self.entityname_field.setText("") # To clear the NAME Field if the user enter anything
        conn = sqlite3.connect("KSUPayDB.db")
        bal = 0
        type = "KSU"
        Cash_query = f'UPDATE ENTITIES SET BALANCE = {0} WHERE WALLETTYPE = "KSU" '
        conn.execute(Cash_query)
        cursor = conn.execute("SELECT * from ENTITIES")
        for x in cursor:
            print(x)
        conn.commit()
        self.label_msg.setText("All KSU ENTITIES now have 0 Riyals\n in their accounts")
        query_all_balance = 'SELECT SUM(BALANCE) FROM ENTITIES'
        cur = conn.execute(query_all_balance)
        all_balance = cur.fetchone()[0]
        self.label_totalbalance.setText(str(all_balance))
        conn.close()


    def back(self):
        signup = Signup()
        widget.addWidget(signup)
        widget.setCurrentIndex(widget.currentIndex() + 1)
    def backup(self):
        self.label_msg.setText("") # To clear the msg that showed up to the user
        self.label_error.setText("") # To clear the error msg '' ''
        self.entityname_field.setText("") # To clear the NAME Field if the user enter anything
        conn = sqlite3.connect("KSUPayDB.db")
        file = open("backup.csv",'w',newline='')
        csvwriter = csv.writer(file)
        cursor = conn.execute("SELECT * FROM ACCOUNT")
        for x in cursor:
            csvwriter.writerow(x)
        cursor = conn.execute("SELECT * FROM ENTITIES")
        for x in cursor:
            csvwriter.writerow(x)

        file.close()
        conn.close()
        self.label_msg.setText("The system has been \nbacked up successfully")
        # print("Backup all the database")
#Main
try:
    timedate = datetime.datetime.now()
    timedate = timedate.strftime("%d-%m-%Y_%H-%M-%S")
    conn = sqlite3.connect("KSUPayDB.db")
    print("We enter the db ")
    # Table for students , etc
    conn.execute('''CREATE TABLE ACCOUNT (FNAME TEXT NOT NULL,
    LNAME TEXT NOT NULL,
    SID INT PRIMARY KEY NOT NULL,
    PASSWORD VARCHAR(50) NOT NULL,
    EMAIL VARCHAR(320) NOT NULL,
    PHNUM CHAR(10) NOT NULL,
    WALLETNUMBER VARCHAR(10) NOT NULL,
    WALLETTYPE VARCHAR(30) NOT NULL,
    BALANCE REAL NOT NULL,
    DATETIME TEXT NOT NULL);''')
    conn.execute(f'''INSERT INTO ACCOUNT (FNAME,LNAME,SID,PASSWORD,EMAIL,PHNUM,WALLETNUMBER,WALLETTYPE,BALANCE,DATETIME)
    VALUES ('Admin','Admin',1112223334,'Admin123',"Admin1@ksu.edu.sa",'0500000000',1,'Admin',0,'{timedate}');''')
    # Table for KSU Entities Such as Bookstore , etc
    conn.execute('''CREATE TABLE ENTITIES (NAME TEXT NOT NULL,
    DATETIME TEXT NOT NULL,
    WALLETNUMBER VARCHAR(10) NOT NULL,
    WALLETTYPE VARCHAR(30) NOT NULL,
    BALANCE REAL NOT NULL);''')
    print("We've created the table successfully")
    conn.commit()
    conn.close()
except sqlite3.OperationalError:
    print("Table Already exists")

app = QApplication(sys.argv)
sign = Signup()
widget = QStackedWidget() # Stack of widgets
widget.addWidget(sign)
widget.setFixedHeight(700)
widget.setFixedWidth(700)
widget.setWindowTitle("KSU Pay")

widget.show()
try :
    sys.exit(app.exec_()) # if we click on exit button
except:
    print("Exiting")

# Signup()