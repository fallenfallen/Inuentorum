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

    QJsonDocument doc = QJsonDocument::fromJson(response);
    QJsonObject jsonObject = doc.object();
    QJsonObject::iterator itr = jsonObject.find("access_token");
    tocken = itr.value().toString();
}

void Facebook::getCode(QString t)
{
    code = t;
    getTocken();
}
