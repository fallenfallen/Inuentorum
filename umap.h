#ifndef UMAP_H
#define UMAP_H


#include "uqt.h"
#include <QWebEngineView>
#include <QWebChannel>


class UMap : public QWebEngineView
{
    QWebChannel *channel;


public:

    UQt *qt;

    explicit UMap (QWidget *parent = Q_NULLPTR);


protected:

    virtual void contextMenuEvent (QContextMenuEvent *) override;
};


#endif // UMAP_H
