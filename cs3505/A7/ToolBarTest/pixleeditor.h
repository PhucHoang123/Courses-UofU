#ifndef PIXLEEDITOR_H
#define PIXLEEDITOR_H

#include <QString>
#include <QObject>

class PixleEditor : public QObject
{
    Q_OBJECT

public:
    PixleEditor(QObject *parent = nullptr);
    //virtual ~PixleEditor();
    void setTool(const QString& toolName);
    void setToolSize(int size);

private:
    QString currentTool;  // Holds the name of the current tool
    int toolSize;         // Holds the size of the current tool
};

#endif // PIXLEEDITOR_H

