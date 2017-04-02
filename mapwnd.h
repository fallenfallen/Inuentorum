#ifndef MAPWND_H
#define MAPWND_H

#include <QMainWindow>

namespace Ui {
class MapWnd;
}

class MapWnd : public QMainWindow
{
    Q_OBJECT

public:
    explicit MapWnd(QWidget *parent = 0);
    ~MapWnd();

private:
    Ui::MapWnd *ui;
};

#endif // MAPWND_H
