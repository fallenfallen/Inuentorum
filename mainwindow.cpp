
#include "mainwindow.h"
#include "ui_mainwindow.h"


MainWindow::MainWindow (QWidget *parent)
    : QMainWindow (parent),
    ui (new Ui::MainWindow)
{
    ui->setupUi (this);

    map = new UMap (this);
    setCentralWidget (map);
}


MainWindow::~MainWindow ()
{
    delete ui;
}

