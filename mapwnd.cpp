#include <QtWidgets>
#include <QtWebEngineWidgets>
#include "mapwnd.h"

MapWnd::MapWnd(const QUrl& url)
{
    view = new QWebEngineView(this);
    view->load(QUrl("qrc:/html/google_maps.html"));
    connect(view, SIGNAL(loadFinished(bool)), SLOT(finishLoading(bool)));
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
