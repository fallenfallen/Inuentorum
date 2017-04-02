
#ifndef UMAP_H
#define UMAP_H


#include <QWebEngineView>


class UMap : public QWebEngineView
{


public:

    explicit UMap (QWidget *parent = Q_NULLPTR);
    ~UMap ();


protected:

    virtual void contextMenuEvent (QContextMenuEvent *) override;
};


#endif // UMAP_H
