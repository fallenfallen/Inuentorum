#include <QtWidgets>
#include <QtWebEngineWidgets>
#include "mapwnd.h"


MapWnd::MapWnd (QWidget *)
    : map (new UMap (this))
{
    connect (map->qt, SIGNAL (loginFacebook ()), this, SLOT (facebookAuth ()));

    setCentralWidget(map);
    setWindowTitle (QStringLiteral ("Inuentorum"));
    setMinimumWidth (900);
    setMinimumHeight (500);
}


MapWnd::~MapWnd()
{
}


void MapWnd::facebookAuth()
{
    map->qt->fb->showAuthWindow();
    connect(map->qt->fb, SIGNAL(completed()), SLOT(onfbloggedIn()));
}


void MapWnd::onfbloggedIn()
{
    UserData tmp = map->qt->fb->getUserData();

    QString code;
    code =  QString("setProfile('%1', '%2', '%3', '%4');")
            .arg(tmp.fullName)
            .arg(tmp.photoLnk)
            .arg (tmp.user_id)
            .arg (map->qt->fb->tocken);
    map->page()->runJavaScript(code);
}
