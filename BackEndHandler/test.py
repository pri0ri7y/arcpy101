 #!/usr/bin/python 
import cgitb
import cgi
import json 
import arcpy
from arcpy import env

# Setting ArcPy environment 
env.workspace = r'D:\OTHERS\GITHUB-NEW\ARCPY101\BackEndHandler\Default.gdb'
  
def init():
	cgitb.enable()
	
	print "Content-Type: text/plain;charset=utf-8"
	print
	 
def getFeatureClassList():    
	featureclasses = arcpy.ListFeatureClasses()	 
	json_string  = json.dumps(featureclasses)
	print json_string 
		
		
def getFieldsList(fc):
	fieldnames = [f.name for f in arcpy.ListFields(fc)]
	json_string  = json.dumps(fieldnames)
	print json_string

	
def getQueryResults(fc,query):
	Arr = []
	with arcpy.da.SearchCursor(fc,"*",query) as cursor:
		for row in cursor:
			Arr.append(row)
			
	json_string  = json.dumps(Arr)
	print json_string
	
	
	
		
def  getArgs():
	  arguments = cgi.FieldStorage()
	  task =  arguments['task'].value
	   
	  if task == "getFeatureClassList":
	     getFeatureClassList()
	  
	  if task == "getFieldsList":
		 fc = arguments['fc'].value
		 getFieldsList(fc)
		 
	  if task == "getQueryResults":
		  fc = arguments['fc'].value
		  query = arguments['query'].value
		  getQueryResults(fc,query)
		 
if __name__ == "__main__":
	init()
	getArgs() 