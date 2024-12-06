import os

# os.listdir()

with open('./input.txt', 'r') as file:
    input = [line.strip() for line in file]

rules = []
updates = []

for line in input:
    if '|' in line:
        rules.append(line)
    else:
        updates.append(line)