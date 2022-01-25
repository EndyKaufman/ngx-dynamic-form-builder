import { Exclude, Expose, Type, Transform, classToClass, classToPlain, plainToClass, } from 'class-transformer-global-storage';
import { DynamicFormBuilder, getGlobal } from '..';
import { getMetadataStorage } from 'class-validator-multi-lang';
  
   import 'reflect-metadata';

/**
 * Note: jest uses cjs modules
 */

describe('allowed nested models', () => {

	getMetadataStorage(); // required so that formbuilder will not abort because of missing validator

	describe('empty data -- submodel', ()=>{
		it('should not create any submodels if a empty list is specified', () => {
			const defaultMetadataStorage = getGlobal()['classTransformerMetadataStorage'] || undefined;
			defaultMetadataStorage.clear();
	
			class Company {
				@Expose()
				name?: string;
				@Expose()
				@Type(()=>User)
				manager?:any;
			}
		
			class User {
				@Expose()
				name?: string;
		
				@Type(type => Company, {})
				@Expose()
				optCompany?: Company = undefined;
			}
	
			const fb = new DynamicFormBuilder();
	
			const form = fb.rootFormGroup(User,{}, {allowedNestedModels:[],maxNestedModelDepth:10})
	
			expect(form.value.optCompany).toBeUndefined();
	
		});
		it('should create direct submodel', () => {
			const defaultMetadataStorage = getGlobal()['classTransformerMetadataStorage'] || undefined;
			defaultMetadataStorage.clear();
	
			class Company {
				@Expose()
				name?: string;
				@Expose()
				@Type(()=>User)
				manager?:any;
			}
		
			class User {
				@Expose()
				name?: string;
		
				@Type(type => Company, {})
				@Expose()
				optCompany?: Company = undefined;
			}
	
			const fb = new DynamicFormBuilder();
	
			const form = fb.rootFormGroup(User,{}, {allowedNestedModels:['optCompany'],maxNestedModelDepth:10})
	
			expect(form.value.optCompany).toBeDefined();
			expect(form.value.optCompany.manager).toBeUndefined();
	
		});
		it('should create nested submodel', () => {
			const defaultMetadataStorage = getGlobal()['classTransformerMetadataStorage'] || undefined;
			defaultMetadataStorage.clear();
	
			class Company {
				@Expose()
				name?: string;
				@Expose()
				@Type(()=>User)
				manager?:any;
			}
		
			class User {
				@Expose()
				name?: string;
		
				@Type(type => Company, {})
				@Expose()
				optCompany?: Company = undefined;
			}
	
			const fb = new DynamicFormBuilder();
	
			const form = fb.rootFormGroup(User,{}, {allowedNestedModels:['optCompany','optCompany.manager'],maxNestedModelDepth:10})
	
			expect(form.value.optCompany).toBeDefined();
			expect(form.value.optCompany.manager).toBeDefined();
			expect(form.value.optCompany.manager.optCompany).toBeUndefined();
	
		});
	})

	describe('empty data -- array submodel', ()=>{

		it('should not create array submodel if not in list', () => {
			const defaultMetadataStorage = getGlobal()['classTransformerMetadataStorage'] || undefined;
			defaultMetadataStorage.clear();

			class Company {
				@Expose()
				name?: string;
				@Expose()
				@Type(()=>User)
				users?:any[];
			}
		
			class User {
				@Expose()
				name?: string;
		
				@Type(type => Company, {})
				@Expose()
				optCompany?: Company = undefined;
			}

			const fb = new DynamicFormBuilder();

			const form = fb.rootFormGroup(User,{}, {allowedNestedModels:['optCompany'],maxNestedModelDepth:10})

			expect(form.value.optCompany).toBeDefined();
			expect(form.value.optCompany.users).toBeUndefined();

		});	

		/*

		Problem here: For unknown reasons, class-transformer is not able to determine the array type of Company.users.

		it('should create array submodel if specified in list', () => {
			const defaultMetadataStorage = getGlobal()['classTransformerMetadataStorage'] || undefined;
			defaultMetadataStorage.clear();

			class Company {
				@Expose()
				name?: string;
				@Expose()
				@Type(()=>User)
				users:User[] = [];
			}
		
			class User {
				@Expose()
				name?: string;
		
				@Type(type => Company, {})
				@Expose()
				optCompany?: Company = undefined;
			}

			const fb = new DynamicFormBuilder();

			const form = fb.rootFormGroup(User,{}, {allowedNestedModels:['optCompany','optCompany.users'],maxNestedModelDepth:10})
console.log(form.value.optCompany);
			expect(form.value.optCompany).toBeDefined();
			expect(form.value.optCompany.users).toBeDefined();
			expect(Array.isArray(form.value.optCompany.users)).toBeTruthy();
			expect(form.value.optCompany.users.length).toBe(0);

		});	
		*/

	});

});
