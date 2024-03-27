import uuid
import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
import sqlalchemy as sa

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)

# create the app
app = Flask(__name__)
# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
# initialize the app with the extension
db.init_app(app)

class Set(db.Model):
    __tablename__ = "sets"
    setId: Mapped[str] = mapped_column(primary_key=True)
    player1Username: Mapped[str]
    player2Username: Mapped[str]
    player1Wins: Mapped[int]
    player2Wins: Mapped[int]
    datePlayed: Mapped[str]

    @property
    def serialize(self):
        return {
            'setId': self.setId,
            'player1Username': self.player1Username,
            'player2Username': self.player2Username,
            'player1Wins': self.player1Wins,
            'player2Wins': self.player2Wins,
            'datePlayed': self.datePlayed
        }


class Player(db.Model):
   __tablename__ = "players"
   username: Mapped[str] = mapped_column(primary_key=True)
   region: Mapped[str]
   character: Mapped[str]

with app.app_context():
    db.create_all()

@app.route('/time')
def get_current_time():
    return {'time': sa.__version__}

@app.route('/addSet', methods=['POST'])
def add_set():
    set = Set(
        setId = str(uuid.uuid4()),
        player1Username = request.form['p1name'],
        player2Username = request.form['p2name'],
        player1Wins = int(request.form['p1wins']),
        player2Wins = int(request.form['p2wins']),
        datePlayed = str(datetime.datetime.now().strftime('%d %b %Y, %I:%M%p'))
    )
    db.session.add(set)
    db.session.commit()
    return jsonify(
       msg="success",
       status=200
    )

@app.route('/getSets', methods=['POST'])
def get_sets():
    playerUsername = request.form['playerName']
    print("Player Username: " + playerUsername)

    sets = db.session.query(Set).filter(sa.or_(Set.player1Username == playerUsername, Set.player2Username == playerUsername)).all()
    for i in range(len(sets)):
        sets[i] = sets[i].__dict__
        sets[i].pop('_sa_instance_state')
        print(sets[i])

    return jsonify(
       msg="success",
       result=sets,
       status=200
    )

@app.route('/deleteSet', methods=['delete'])
def deleteSet():
    setId = request.form['setId']
    print("setId: " + setId)

    # Can't pass setId1 directly to text with formatting, have to bind it 
    command = sa.text("DELETE FROM sets WHERE setId=:setId1").\
            bindparams(setId1=setId)
    print("prepared statement: ", command)
    db.session.execute(command)
    db.session.commit()
    return jsonify(
       msg="success",
       status=200
    )

@app.route('/incrementWins', methods=['post'])
def incrementWins():
    setId = request.form['setId']
    player = request.form['playerUsername']
    player1Command = sa.text("UPDATE sets SET player1Wins = player1Wins + 1 \
                             WHERE setId=:setId1 AND player1Username=:player1").\
                             bindparams(setId1=setId, player1=player)
    player2Command = sa.text("UPDATE sets SET player2Wins = player2Wins + 1 \
                             WHERE setId=:setId1 AND player2Username=:player1").\
                             bindparams(setId1=setId, player1=player)
    db.session.execute(player1Command)
    db.session.execute(player2Command)
    db.session.commit()
    return jsonify(
        msg="success",
        status=200
    )

@app.route('/decrementWins', methods=['post'])
def decrementWins():
    setId = request.form['setId']
    player = request.form['playerUsername']
    player1Command = sa.text("UPDATE sets SET player1Wins = player1Wins - 1 \
                             WHERE setId=:setId1 AND player1Username=:player1").\
                             bindparams(setId1=setId, player1=player)
    player2Command = sa.text("UPDATE sets SET player2Wins = player2Wins - 1 \
                             WHERE setId=:setId1 AND player2Username=:player1").\
                             bindparams(setId1=setId, player1=player)
    db.session.execute(player1Command)
    db.session.execute(player2Command)
    db.session.commit()
    return jsonify(
        msg="success",
        status=200
    )