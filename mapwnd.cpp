#include "mapwnd.h"
#include "ui_mapwnd.h"

MapWnd::MapWnd(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MapWnd)
{
    ui->setupUi(this);
}

MapWnd::~MapWnd()
{
    delete ui;
}
