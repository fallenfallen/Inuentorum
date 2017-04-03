#include <QtWidgets>
#include <QtWebEngineWidgets>
#include "mapwnd.h"


MapWnd::MapWnd (QWidget *)
    : map (new UMap (this))
{
    connect (map->qt, SIGNAL (loginFacebook ()), this, SLOT (facebookAuth ()));

    fb = new Facebook("1808955962713438", "093350c2fe425997e271b3ccf323f5b90");

    setCentralWidget(map);
    setWindowTitle (QStringLiteral ("Inuentorum"));
}


MapWnd::~MapWnd()
{
    delete fb;
}


void MapWnd::facebookAuth()
{
    fb->showAuthWindow();
    connect(fb, SIGNAL(completed()), SLOT(onfbloggedIn()));
}


void MapWnd::onfbloggedIn()
{
    UserData tmp = fb->getUserData();

    QString code;
    code =  QString("setProfile('%1', '%2', '%3'); textDialog.dismiss ();").arg(tmp.fullName).arg(tmp.photoLnk).arg (tmp.user_id);
    map->page()->runJavaScript(code);

    code =  QString("textDialog.show (tr('Hold on!'), tr ('You can place markers simply clicking on a place with right mouse button'), tr ('Got it!'))");
    map->page()->runJavaScript(code);

}
