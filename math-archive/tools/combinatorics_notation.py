"""Use Korean textbook nCr/nPr notation in authored mathematics."""
import re

COMMAND = re.compile(r'\\(?:[dt]?binom)(?![A-Za-z])')

def argument(text, start):
    i=start
    while i<len(text) and text[i].isspace(): i+=1
    if i==len(text):raise ValueError('Missing combinatorics argument: '+text)
    if text[i]=='{':
        depth=1;j=i+1
        while j<len(text):
            if text[j]=='\\':
                command=re.match(r'\\(?:[A-Za-z]+|.)',text[j:]);j+=len(command[0]);continue
            if text[j]=='{':depth+=1
            elif text[j]=='}':
                depth-=1
                if not depth:return text[i+1:j],j+1
            j+=1
        raise ValueError('Unclosed combinatorics argument: '+text)
    if text[i]=='\\':
        command=re.match(r'\\(?:[A-Za-z]+|.)',text[i:]);return command[0],i+len(command[0])
    return text[i],i+1

def symbol(n,r,kind='C'):
    assert kind in ('C','P')
    return '{{}_{'+n+'}\\mathrm{'+kind+'}_{'+r+'}}'

def convert_math(text):
    result=[];end=0
    while match:=COMMAND.search(text,end):
        result.append(text[end:match.start()])
        n,i=argument(text,match.end());r,end=argument(text,i)
        result.append(symbol(convert_math(n),convert_math(r)))
    result.append(text[end:])
    return ''.join(result)

def convert_text(text):
    return re.sub(r'\$([^$]*)\$',lambda m:'$'+convert_math(m[1])+'$',text)

def convert_tree(value):
    if isinstance(value,str):return convert_text(value)
    if isinstance(value,list):return [convert_tree(v) for v in value]
    if isinstance(value,dict):return {k:convert_tree(v) for k,v in value.items()}
    return value
