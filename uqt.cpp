#include "uqt.h"


UQt::UQt(QObject *parent)
    : QObject(parent)
{

}


void
UQt::loginFacebookSlot ()
{
    emit loginFacebook ();
}
