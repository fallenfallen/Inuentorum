#include "mapwnd.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MapWnd w;
    w.show();

    return a.exec();
}
