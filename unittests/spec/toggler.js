describe("Toggler Tests", function() {

    beforeEach(function() {
        this.toggler = nb.find('toggler');
    });

    afterEach(function() {
        delete this.toggler;
    });

    describe("init", function() {

        it('toggler-checked should has checked after init', function() {
            var toggler = nb.find('toggler-checked');
            expect(toggler.isChecked()).to.be.equal(true);
        });

        it('toggler-disabled should has disabled after init', function() {
            var toggler = nb.find('toggler-disabled');
            expect(toggler.isEnabled()).to.be.equal(false);
        });

    });

    describe("#getValue()", function() {

        it('should return value', function() {
            expect(this.toggler.getValue()).to.be.equal('value');
        });

        it('should return new value after setValue', function() {
            this.toggler.setValue('new-value');
            expect(this.toggler.getValue()).to.be.equal('new-value');
        });

    });

    describe("#setValue()", function() {

        it('should set new value to DOM', function() {
            this.toggler.setName('new-name');
            expect(this.toggler.$control.attr('name')).to.be.equal('new-name');
        });

        it("should throws nb-input_value-set event", function() {
            var handlerWorks = false;
            this.toggler.on('nb-toggler_value-set', function() {
                handlerWorks = true;
            });
            this.toggler.setValue('Vadim');

            expect(handlerWorks).to.be.ok();
        });

    });

    describe("#getName()", function() {
        it('should return new name after setValue', function() {
            this.toggler.setName('new-name');
            expect(this.toggler.getName()).to.be.equal('new-name');
        });

    });

    describe("#setName()", function() {

        it('should set new name to DOM', function() {
            this.toggler.setName('new-name');
            expect(this.toggler.$control.attr('name')).to.be.equal('new-name');
        });

        it("should throws nb-input_name-set event", function() {
            var handlerWorks = false;
            this.toggler.on('nb-toggler_name-set', function() {
                handlerWorks = true;
            });
            this.toggler.setName('new-name');

            expect(handlerWorks).to.be.ok();
        });

    });


    describe("#isChecked()", function() {
        it("should return false when not checked", function() {
            expect(this.toggler.isChecked()).to.not.ok();
        });

        it("should return true when checked", function() {
            this.toggler.check();
            expect(this.toggler.isChecked()).to.be.ok();
        });
    });

    describe("#isEnabled()", function() {
        it("should return true when enabled", function() {
            expect(this.toggler.isEnabled()).to.be.ok();
        });

        it("should return false when disabled", function() {
            this.toggler.disable();
            expect(this.toggler.isEnabled()).not.to.be.ok();
        });
    });

    describe("#disable()", function() {
        it("check state", function() {
            this.toggler.disable();
            expect(this.toggler.isEnabled()).to.not.ok();
        });

        it("check event", function() {
            var flag = true;

            this.toggler.on('nb-toggler_disabled', function() {
                flag = false;
            });

            this.toggler.disable();

            expect(flag).to.not.ok();
        });
    });

    describe("#enable()", function() {
        it("check state", function() {
            this.toggler.disable();
            this.toggler.enable();
            expect(this.toggler.isEnabled()).to.ok();
        });

        it("check event", function() {
            var flag = false;
            this.toggler.on('nb-toggler_enabled', function() {
                flag = true;
            });

            this.toggler.disable();
            this.toggler.enable();
            expect(flag).to.ok();
        });
    });

    describe("#check()", function() {
        it("check state", function() {
            this.toggler.check();
            expect(this.toggler.isChecked()).to.ok();
        });

        it("check event", function() {
            var flag = false;
            this.toggler.on('nb-toggler_checked', function() {
                flag = true;
            });

            this.toggler.check();
            expect(flag).to.ok();
        });
    });

    describe("#uncheck()", function() {
        it("check state", function() {
            this.toggler.check();
            this.toggler.uncheck();
            expect(this.toggler.isChecked()).to.not.ok();
        });

        it("check event", function() {
            var flag = false;
            this.toggler.on('nb-toggler_unchecked', function() {
                flag = true;
            });

            this.toggler.check();
            this.toggler.uncheck();
            expect(flag).to.ok();
        });
    });


    describe("#toggle()", function() {
        it("Should check() then isChecked == false", function() {
            this.toggler.check();
            this.toggler.uncheck();
            this.toggler.toggle();
            expect(this.toggler.isChecked()).to.ok();
        });

        it("Should uncheck() then isChecked == true", function() {
            this.toggler.uncheck();
            this.toggler.check();
            this.toggler.toggle();
            expect(this.toggler.isChecked()).to.not.ok();
        });

        it("Should work on click()", function() {
            this.toggler.check();
            this.toggler.uncheck();
            this.toggler.trigger('click');
            expect(this.toggler.isChecked()).to.not.ok();
        });

    });

    describe("#destroy()", function() {

        beforeEach(function() {
            sinon.spy(nb, 'destroy');
        });

        afterEach(function() {
            nb.destroy.restore();
        });

        it("should call nb.destroy('input')", function() {
            this.toggler.destroy();
            expect(nb.destroy.calledWithExactly('toggler')).to.be.equal(true);
        });
    });

});
