
#include "mainwindow.h"
#include <QApplication>
#include <QWebSettings>


int
main (int argc, char *argv[])
{
    QApplication a (argc, argv);

    QWebSettings::globalSettings ()->setAttribute (QWebSettings::PrivateBrowsingEnabled, true);

#ifndef QT_NO_DEBUG

    QWebSettings::globalSettings ()->setAttribute (QWebSettings::DeveloperExtrasEnabled, true);

#endif

    MainWindow w;
    w.show ();

    return a.exec ();
}
