#include "Facebook.h"


Facebook::Facebook(QString _app_id, QString _app_secret):
    app_id(_app_id), app_secret(_app_secret)
{
    this->authFlag = false;
    this->tocken = "";
}

void Facebook::showAuthWindow()
{
    FBwnd = new FBAuthWnd();
    FBwnd->show();
    connect(FBwnd, SIGNAL(sendCode(QString)), SLOT(getCode(QString)));
}

UserData Facebook::getUserData(QString id)
{
    UserData inf;

    if(id=="me")
        inf.user_id = this->getUserId();
    else
        inf.user_id = id;

    inf.fullName = this->getUserName(id);
    inf.photoLnk = this->getUserPhoto(id);

    //qDebug()<<"USER PHOTO: "<<inf.photoLnk;

    return inf;
}

bool Facebook::isAuth()
{
    return this->authFlag;
}

void Facebook::logout()
{
    this->tocken = "";
    this->authFlag = false;
    this->code = "";
}

void Facebook::getTocken()
{
    QString reqStr = QString("https://graph.facebook.com/v2.8/oauth/access_token?"
                             "client_id=1808955962713438"
                             "&redirect_uri=https://www.facebook.com/connect/login_success.html"
                             "&client_secret=093350c2fe425997e271b3ccf323f5b9"
                             "&code=%1").arg(code);
    Request req;
    req.setAddress(reqStr);
    RequestSender* sender = new RequestSender(3500);
    QByteArray response = sender->get(req);

    //qDebug()<<"[getTocken] tocken:"<<response;
    if(response!="")
    {
        QJsonDocument doc = QJsonDocument::fromJson(response);
        QJsonObject jsonObject = doc.object();
        QJsonObject::iterator itr = jsonObject.find("access_token");
        tocken = itr.value().toString();
        this->authFlag = true;
        emit completed();
    }
}

void Facebook::getCode(QString t)
{
    code = t;
    //qDebug()<<"[getCode func] code:"<<code;
    getTocken();
}

QString Facebook::getUserId()
{
    QString reqStr = QString("https://graph.facebook.com/v2.8/me?access_token=%1").arg(tocken);
    Request req;
    req.setAddress(reqStr);
    RequestSender* sender = new RequestSender(3500);
    QByteArray response = sender->get(req);
    if(response!="")
    {
        QJsonDocument doc = QJsonDocument::fromJson(response);
        QJsonObject jsonObject = doc.object();
        return jsonObject.find("id").value().toString();
    }

    return "";
}

QString Facebook::getUserName(QString id)
{
    QString reqStr = QString("https://graph.facebook.com/v2.8/%1?access_token=%2").arg(id).arg(tocken);
    Request req;
    req.setAddress(reqStr);
    RequestSender* sender = new RequestSender(3500);
    QByteArray response = sender->get(req);

    if(response!="")
    {
        QJsonDocument doc = QJsonDocument::fromJson(response);
        QJsonObject jsonObject = doc.object();
        return jsonObject.find("name").value().toString();
    }

    return "";
}

QString Facebook::getUserPhoto(QString id)
{
    QString reqStr = QString("https://graph.facebook.com/%1/picture?redirect=0&fields=url&access_token=%2").arg(id).arg(tocken);
    Request req;
    req.setAddress(reqStr);
    RequestSender* sender = new RequestSender(3500);
    QByteArray response = sender->get(req);

    if(response!="")
    {
        QJsonDocument doc = QJsonDocument::fromJson(response);
        QJsonObject jsonObject = doc.object();
        return jsonObject.find("data").value().toObject().find("url").value().toString();
    }

    return "";
}
