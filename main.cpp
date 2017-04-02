
#include "mainwindow.h"
#include <QApplication>
#include <QWebEngineSettings>


int
main (int argc, char *argv[])
{
    QApplication a (argc, argv);

    QWebEngineSettings::globalSettings ()->setAttribute (QWebEngineSettings::ErrorPageEnabled, false);

#ifndef QT_NO_DEBUG

    if (!qputenv ("QTWEBENGINE_REMOTE_DEBUGGING", QByteArray::fromRawData ("2048", sizeof ("2048")))) {
        qFatal ("qputenv failed");
    }

#endif

    MainWindow w;
    w.show ();

    return a.exec ();
}