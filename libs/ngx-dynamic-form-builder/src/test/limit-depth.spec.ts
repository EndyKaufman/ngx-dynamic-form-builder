import { Expose, Type } from 'class-transformer-global-storage';
import { getMetadataStorage } from 'class-validator-multi-lang';
import 'reflect-metadata';
import { DynamicFormBuilder, getGlobal } from '..';
  

/**
 * Note: jest uses cjs modules
 */

describe('limit depth', () => {

	getMetadataStorage(); // required so that formbuilder will not abort because of missing validator

	it('should respect depth of 2', () => {
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

		const form = fb.rootFormGroup(User,{},{maxNestedModelDepth:2})

		expect(form.value.optCompany).toBeDefined();
		expect(form.value.optCompany.manager).toBeDefined();
		expect(form.value.optCompany.manager.optCompany).toBeUndefined();

	});

	it('should respect depth of 0', () => {
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

		const form = fb.rootFormGroup(User,{},{maxNestedModelDepth:0})

		expect(form.value.optCompany).toBeUndefined();

	});

	it('should allow partial recursiveness', () => {
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

		const form = fb.rootFormGroup(User,{},{maxNestedModelDepth:5})

		expect(form.value.optCompany.manager.optCompany).toBeDefined();
		expect(form.value.optCompany.manager.optCompany.manager).toBeDefined();
		expect(form.value.optCompany.manager.optCompany.manager.optCompany).toBeDefined();
		expect(form.value.optCompany.manager.optCompany.manager.optCompany.manager).toBeUndefined();

	});
});
