#-------------------------------------------------
#
# Project created by QtCreator 2017-04-02T16:22:54
#
#-------------------------------------------------

QT      +=  webenginewidgets

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = release_project
TEMPLATE = app

DEFINES += QT_DEPRECATED_WARNINGS

SOURCES += main.cpp\
        mapwnd.cpp \
    Rest_sender/request.cpp \
    Rest_sender/requestsender.cpp

HEADERS  += mapwnd.h \
    Rest_sender/request.h \
    Rest_sender/requestsender.h

FORMS    += mapwnd.ui

# install
target.path = $$[QT_INSTALL_EXAMPLES]/webenginewidgets/contentmanipulation
INSTALLS += target
