#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE_LENGTH 1024

void replace_leading_spaces(FILE *input, FILE *output) {
    char line[MAX_LINE_LENGTH];
	    while (fgets(line, sizeof(line), input) != NULL) {
		        int i = 0;
		        while (line[i] == ' ' && i < 4) {
				            i++;
				        }
		        int leading_spaces = i;
		        int new_leading_spaces = leading_spaces / 2;
		
		        for (int j = 0; j < new_leading_spaces; j++) {
				            fputc(' ', output);
							        }
				
				        fputs(&line[leading_spaces], output);
						    }
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
	        fprintf(stderr, "Usage: %s <filename>\n", argv[0]);
			        return 1;
					    }
	
	    FILE *input = fopen(argv[1], "r");
		    if (!input) {
			        perror("Error opening file");
					        return 1;
							    }
			
			    FILE *output = fopen("output.txt", "w");
				    if (!output) {
					        perror("Error creating output file");
							        fclose(input);
									        return 1;
											    }
					
					    replace_leading_spaces(input, output);
						
						    fclose(input);
							    fclose(output);
								
								    printf("Leading spaces replaced in output.txt\n");
									
									    return 0;
}
