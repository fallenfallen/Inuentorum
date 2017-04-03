#include "uqt.h"
#include <QDebug>

UQt::UQt(QObject *parent)
    : QObject(parent)
{

}


void
UQt::loginFacebookSlot ()
{
    if (loginFacebookEmitted) {
        qWarning ("loginFacebook () has already been emitted");

        return;
    }

    loginFacebookEmitted = true;

    emit loginFacebook ();
}
