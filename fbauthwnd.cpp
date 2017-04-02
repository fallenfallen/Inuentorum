#include <QtWidgets>
#include <QtWebEngineWidgets>
#include "fbauthwnd.h"

FBAuthWnd::FBAuthWnd()
{
    wview = new QWebEngineView(this);
    wview->load(QUrl("https://www.facebook.com/v2.8/dialog/oauth?client_id=1808955962713438&redirect_uri=https://www.facebook.com/connect/login_success.html"));
    connect(wview, SIGNAL(loadFinished(bool)), SLOT(finishLoading(bool)));
    setCentralWidget(wview);
}


void FBAuthWnd::finishLoading(bool)
{
    QString url = wview->url().toString();
    if(!url.contains("login.php"))
    {
        url.remove("https://www.facebook.com/connect/login_success.html?code=");
        code = url;
        emit sendCode(code);
        this->close();
    }
}
