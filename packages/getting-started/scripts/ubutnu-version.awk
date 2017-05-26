BEGIN {
	regex=14.04;
	err=1;
	print "Checking for Ubuntu version ",regex,"\n";
}{

	if ($1=="DISTRIB_RELEASE"){
		if (match($2,regex) ){

			printf "Ubuntu release %d\n" , $2;
			err =0;			
		}

		
	}
}
END{
	exit err;
}