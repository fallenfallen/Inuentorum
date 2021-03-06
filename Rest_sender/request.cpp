#include "request.h"

Request::Request(QString address /*= QString()*/)
{
    setAddress(address);
}

QString Request::address() const
{
    return _address;
}

void Request::setAddress(QString address)
{
    for (QPair<QString, QString> value : QUrlQuery(QUrl(address)).queryItems())
    addParam(value.first, value.second);
    _address = address;
}

void Request::addParam(QString name, QVariant value)
{
    _params[name] = value.toString();
}

bool Request::removeParam(QString name)
{
    if (false == _params.contains(name))
        return false;
    _params.remove(name);
    return true;
}

QStringList Request::paramsNames() const
{
    return _params.keys();
}

QMap<QString, QString> Request::params() const
{
    return _params;
}

QUrl Request::url(bool forGetRequest /*= true*/) const
{
    QUrl url(address());
    if (forGetRequest)
        url.setQuery(data());
    return url;
}

QNetworkRequest Request::request(bool forGetRequest /*= true*/) const
{
    QNetworkRequest r(url(forGetRequest));

    if (!forGetRequest)
    {
        r.setHeader(QNetworkRequest::ContentTypeHeader, "application/x-www-form-urlencoded");
    }

    return r;
}

QByteArray Request::data() const
{
    auto b = _params.begin();
    auto e = _params.end();

    QByteArray byteArrayData;

    while (b != e)
    {
        byteArrayData.append(b.key());
        byteArrayData.append('=');
        byteArrayData.append(b.value());
        byteArrayData.append('&');

        b++;
    }

    byteArrayData.chop(1);

    return byteArrayData;
}
