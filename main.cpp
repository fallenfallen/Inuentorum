#include "mapwnd.h"
#include <QApplication>


int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
        qputenv("QTWEBENGINE_REMOTE_DEBUGGING", "23654");
    QUrl url = QUrl("http://www.google.com/ncr");
    MapWnd *browser = new MapWnd(url);
    browser->show();

    return a.exec();
}
