#include <iostream>
using namespace std;
class cat 
{
    private: 
    int lives;

    public:
    cat(int initlives){
        lives = initlives;
    }
    void reportLives()
    {
        cout << lives << endl;
    }
    
    cat operator+=(int additionalLives) {
        cat mycat(additionalLives);
        mycat.lives += additionalLives;
        return mycat;
    }

    cat modCat()
    {
        cat modcat(live);
        return modcat;
    }
};

int main(){
    cat mycat(3);
    mycat += 1;
    mycat += 1;
    mycat.reportLives();
    return 0;
}