
#ifndef MAINWINDOW_H
#define MAINWINDOW_H


#include "umap.h"
#include <QMainWindow>


namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

    UMap *map;


public:

    explicit MainWindow (QWidget *parent = 0);
    ~MainWindow ();


private:

    Ui::MainWindow *ui;
};


#endif // MAINWINDOW_H
