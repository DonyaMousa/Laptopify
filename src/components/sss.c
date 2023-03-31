// write a simple c program that declares an array of doubles with 5 elements as input then loop through the array and find the sum of all the elements in the array and return the sum

#include <stdio.h>

int main()
{
    double arr[5];
    double sum = 0;
    int i;
    for (i = 0; i < 5; i++)
    {
        printf("Enter a number: ");
        scanf("%lf", &arr[i]);
        sum += arr[i];
    }
    printf("Sum = %.2lf", sum);
    return 0;
}


    




