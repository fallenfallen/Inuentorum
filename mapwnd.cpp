#include <QtWidgets>
#include <QtWebEngineWidgets>
#include "mapwnd.h"


MapWnd::MapWnd (QWidget *)
    : map (new UMap (this))
{
    connect (map->qt, SIGNAL (loginFacebook ()), this, SLOT (facebookAuth ()));

    fb = new Facebook("1808955962713438", "093350c2fe425997e271b3ccf323f5b90");

    setCentralWidget(map);
}


MapWnd::~MapWnd()
{
    delete fb;
}


void MapWnd::facebookAuth()
{
    fb->showAuthWindow();
    connect(fb, SIGNAL(completed()), SLOT(loadfriends()));
}


void MapWnd::loadfriends()
{
    UserData tmp = fb->getUserData();

    QString code;
    code =  QString("setProfile('%1', '%2', '%3'); textDialog.dismiss ();").arg(tmp.fullName).arg(tmp.photoLnk).arg (tmp.user_id);
    map->page()->runJavaScript(code);
}
