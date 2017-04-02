#include <QtWidgets>
#include <QtWebEngineWidgets>
#include "mapwnd.h"

MapWnd::MapWnd(const QUrl& url)
{
    view = new QWebEngineView(this);
    view->load(QUrl("qrc:/html/google_maps.html"));
    connect(view, SIGNAL(loadFinished(bool)), SLOT(finishLoading(bool)));

    QPushButton* butt = new QPushButton(this);
    butt->setText("Login with facebook");\
    butt->setGeometry(this->width(), 0, 150, 40);
    //butt->move(100, 100);
    connect(butt, SIGNAL(clicked(bool)), SLOT(facebookAuth(bool)));

    fb = new Facebook("1808955962713438", "093350c2fe425997e271b3ccf323f5b90");

    setCentralWidget(view);
}


void MapWnd::finishLoading(bool)
{
    findLocation();
}

void MapWnd::findLocation()
{
    Request req;
    req.setAddress("http://ipinfo.io/geo");
    RequestSender* sender = new RequestSender(1000);
    QByteArray response = sender->get(req);

    QJsonDocument doc = QJsonDocument::fromJson(response);
    QJsonObject jsonObject = doc.object();
    QJsonObject::iterator itr = jsonObject.find("loc");
    QString location = itr.value().toString();

    QString lat, lng;

    QRegExp regexp("[,]");
    QStringList arr = location.split(regexp, QString::SkipEmptyParts);
    lat = arr.at(0);
    lng = arr.at(1);

    QString code;
    code =  QString("map.setCenter({lat: %1, lng: %2})").arg(lat).arg(lng);
    view->page()->runJavaScript(code);
}

void MapWnd::facebookAuth(bool)
{
    fb->showAuthWindow();
}
