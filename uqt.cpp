#include "uqt.h"
#include <QFile>
#include <QTextStream>


UQt::UQt (QObject *parent) : QObject(parent)
{

}


UQt::~UQt ()
{

}


QString
UQt::loadResource (const QString &path)
{
    QFile file (path);

    if (!file.open (QFile::ReadOnly)) {
        qFatal ("failed to load resource");
    }

    QTextStream textStream (&file);

    return textStream.readAll ();
}
