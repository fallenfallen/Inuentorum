#include "uqt.h"
#include <QDebug>

UQt::UQt(QObject *parent)
    : QObject(parent)
{

    fb = new Facebook("1808955962713438", "093350c2fe425997e271b3ccf323f5b90");
}


UQt::~UQt ()
{
    delete fb;
}


void
UQt::loginFacebookSlot ()
{
    if (loginFacebookEmitted) {
        qWarning ("loginFacebook () has already been emitted");

        return;
    }

    //loginFacebookEmitted = true;

    emit loginFacebook ();
}
