#include <QtWidgets>
#include <QtWebEngineWidgets>
#include "fbauthwnd.h"

FBAuthWnd::FBAuthWnd()
{
    wview = new QWebEngineView(this);
    wview->page()->profile()->cookieStore()->deleteAllCookies();
    wview->load(QUrl("https://www.facebook.com/v2.8/dialog/oauth?client_id=1808955962713438"
                     "&redirect_uri=https://www.facebook.com/connect/login_success.html"
                     "&display=popup"
                     "&scope=user_location,user_friends"));
    wview->page()->profile()->cookieStore()->deleteAllCookies();
    connect(wview, SIGNAL(loadFinished(bool)), SLOT(finishLoading(bool)));
    setCentralWidget(wview);
    wview->setFixedWidth(450);
    wview->setFixedHeight(400);
}


void FBAuthWnd::finishLoading(bool)
{
    QString url = wview->url().toString();
    if(!url.contains("login.php"))
    {
        url.remove("https://www.facebook.com/connect/login_success.html?code=");
        code = url;
        //qDebug()<<"recv code: "<<url;
        emit sendCode(code);
        this->close();
    }
}

