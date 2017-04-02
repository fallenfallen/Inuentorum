#include "uqt.h"

UQt::UQt (QObject *parent)
    : QObject (parent),
      assessor (new UAssessor (this))
{

}


UQt::~UQt ()
{

}


QString
UQt::evaluateTrack (const QString &)
{
    return QString ();
}
